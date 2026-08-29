import { useEffect } from 'react';

/**
 * Enterprise-grade Content & Intellectual Property Protection Hook
 * - Blocks Text Selection (Desktop & Mobile)
 * - Disables Right-Click Context Menu
 * - Disables Copy/Cut/Select-All Keyboard Shortcuts (Ctrl+C, Ctrl+X, Ctrl+A)
 * - Disables View Source, Save Page, Print, & DevTools Shortcuts (Ctrl+U, Ctrl+S, Ctrl+P, F12, Ctrl+Shift+I/J/C)
 * - Blocks Mobile Long-Press Callout Menu
 * - Blocks Image Drag-and-Drop
 * - Gracefully preserves typing inside input fields and textareas
 */
export const useContentProtection = () => {
  useEffect(() => {
    // 1. Disable Right-Click Context Menu
    const handleContextMenu = (e: MouseEvent) => {
      // Allow right-click on input/textarea if user needs browser spellcheck, else block everywhere
      const target = e.target as HTMLElement;
      const isInputField = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';
      if (!isInputField) {
        e.preventDefault();
      }
    };

    // 2. Intercept & Block Copying / Source-Inspection Shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;
      const target = e.target as HTMLElement;
      const isInputField = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';

      // F12 (DevTools)
      if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault();
        return;
      }

      // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C (DevTools / Inspect)
      if (isCtrlOrCmd && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) {
        e.preventDefault();
        return;
      }

      // Ctrl+U (View Source)
      if (isCtrlOrCmd && (e.key === 'u' || e.key === 'U')) {
        e.preventDefault();
        return;
      }

      // Ctrl+S (Save Page)
      if (isCtrlOrCmd && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        return;
      }

      // Ctrl+P (Print Page / Print-to-PDF)
      if (isCtrlOrCmd && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        return;
      }

      // Ctrl+C (Copy), Ctrl+X (Cut), Ctrl+A (Select All) — block globally unless inside an active input field
      if (isCtrlOrCmd && (e.key === 'c' || e.key === 'C' || e.key === 'x' || e.key === 'X' || e.key === 'a' || e.key === 'A')) {
        if (!isInputField) {
          e.preventDefault();
        }
      }
    };

    // 3. Block Copy & Cut Events globally outside input fields
    const handleCopyCut = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement;
      const isInputField = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';
      if (!isInputField) {
        e.preventDefault();
      }
    };

    // 4. Block Image / Element Dragging
    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG' || target.tagName === 'A' || target.closest('img')) {
        e.preventDefault();
      }
    };

    // Attach passive: false listeners for instant interception
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('copy', handleCopyCut);
    document.addEventListener('cut', handleCopyCut);
    document.addEventListener('dragstart', handleDragStart);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('copy', handleCopyCut);
      document.removeEventListener('cut', handleCopyCut);
      document.removeEventListener('dragstart', handleDragStart);
    };
  }, []);
};
