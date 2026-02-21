import { Injectable } from '@angular/core';
import { RenderableField, RenderableLayout } from '../types/renderable-form';

@Injectable({ providedIn: 'root' })
export class LayoutEngineService {
  gridContainerStyles(layout: RenderableLayout): Record<string, string> {
    return {
      display: 'grid',
      'grid-template-columns': `repeat(${layout.columns}, 1fr)`,
      gap: layout.gap,
    };
  }

  fieldStyles(field: RenderableField, totalColumns: number): Record<string, string> {
    const span = Math.min(field.col_span, totalColumns);
    return {
      'grid-column': `span ${span}`,
    };
  }
}
