"""Unit tests for FormDraftValidator — one test per invariant, plus a passing baseline."""
import pytest
from datetime import datetime, timezone

from contexts.form_design.validator import FormDraftValidator
from contexts.form_design.schemas import (
    FormDraft, FormFieldDraft, FormLayoutDraft, FormActionDraft, FormFieldLayout,
)
from shared.renderable_form import FieldOption
from shared.errors import DraftValidationError


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

NOW = datetime.now(timezone.utc).isoformat()


def _field(key: str, type_: str = "text", col_span: int = 1, **kwargs) -> FormFieldDraft:
    return FormFieldDraft(
        key=key,
        type=type_,
        label=key.replace("_", " ").title(),
        layout=FormFieldLayout(col_span=col_span, order=0),
        **kwargs,
    )


def _action() -> FormActionDraft:
    return FormActionDraft(type="submit", label="Submit", color="primary")


def _draft(**overrides) -> FormDraft:
    defaults = dict(
        id="test-id",
        name="Test Form",
        prompt="test",
        version=1,
        status="draft",
        created_at=NOW,
        updated_at=NOW,
        fields=[_field("email", type_="email")],
        layout=FormLayoutDraft(columns=1),
        actions=[_action()],
    )
    defaults.update(overrides)
    return FormDraft(**defaults)


validator = FormDraftValidator()


# ---------------------------------------------------------------------------
# Baseline — valid draft passes without raising
# ---------------------------------------------------------------------------

def test_valid_draft_passes():
    draft = _draft()
    validator.validate(draft)  # must not raise


# ---------------------------------------------------------------------------
# Invariant 1: non-empty name
# ---------------------------------------------------------------------------

def test_invariant_1_empty_name_raises():
    draft = _draft(name="")
    with pytest.raises(DraftValidationError) as exc_info:
        validator.validate(draft)
    fields = [e.field for e in exc_info.value.errors]
    assert "name" in fields


def test_invariant_1_whitespace_name_raises():
    draft = _draft(name="   ")
    with pytest.raises(DraftValidationError) as exc_info:
        validator.validate(draft)
    assert any(e.field == "name" for e in exc_info.value.errors)


# ---------------------------------------------------------------------------
# Invariant 2: unique field keys
# ---------------------------------------------------------------------------

def test_invariant_2_duplicate_keys_raises():
    draft = _draft(fields=[_field("email"), _field("email")])
    with pytest.raises(DraftValidationError) as exc_info:
        validator.validate(draft)
    assert any(e.field == "fields" for e in exc_info.value.errors)


def test_invariant_2_unique_keys_passes():
    draft = _draft(fields=[_field("first_name"), _field("last_name")])
    validator.validate(draft)


# ---------------------------------------------------------------------------
# Invariant 3: col_span <= layout.columns
# ---------------------------------------------------------------------------

def test_invariant_3_col_span_exceeds_columns_raises():
    draft = _draft(
        fields=[_field("name", col_span=3)],
        layout=FormLayoutDraft(columns=2),
    )
    with pytest.raises(DraftValidationError) as exc_info:
        validator.validate(draft)
    assert any("col_span" in e.field for e in exc_info.value.errors)


def test_invariant_3_col_span_within_columns_passes():
    draft = _draft(
        fields=[_field("name", col_span=2)],
        layout=FormLayoutDraft(columns=2),
    )
    validator.validate(draft)


# ---------------------------------------------------------------------------
# Invariant 4: select / radio fields must have at least one option
# ---------------------------------------------------------------------------

def test_invariant_4_select_without_options_raises():
    draft = _draft(fields=[_field("category", type_="select", options=[])])
    with pytest.raises(DraftValidationError) as exc_info:
        validator.validate(draft)
    assert any("options" in e.field for e in exc_info.value.errors)


def test_invariant_4_radio_without_options_raises():
    draft = _draft(fields=[_field("choice", type_="radio", options=[])])
    with pytest.raises(DraftValidationError) as exc_info:
        validator.validate(draft)
    assert any("options" in e.field for e in exc_info.value.errors)


def test_invariant_4_select_with_options_passes():
    options = [FieldOption(label="A", value="a")]
    draft = _draft(fields=[_field("category", type_="select", options=options)])
    validator.validate(draft)


# ---------------------------------------------------------------------------
# Invariant 5: at least one action
# ---------------------------------------------------------------------------

def test_invariant_5_no_actions_raises():
    draft = _draft(actions=[])
    with pytest.raises(DraftValidationError) as exc_info:
        validator.validate(draft)
    assert any(e.field == "actions" for e in exc_info.value.errors)


def test_invariant_5_one_action_passes():
    draft = _draft(actions=[_action()])
    validator.validate(draft)


# ---------------------------------------------------------------------------
# Multiple violations collected together
# ---------------------------------------------------------------------------

def test_multiple_violations_all_reported():
    draft = _draft(
        name="",
        fields=[_field("x"), _field("x")],   # duplicate + name error
        actions=[],                            # no actions
    )
    with pytest.raises(DraftValidationError) as exc_info:
        validator.validate(draft)
    error_fields = [e.field for e in exc_info.value.errors]
    assert "name" in error_fields
    assert "fields" in error_fields
    assert "actions" in error_fields
