import { useEffect, useRef } from 'react';

/**
 * Makes the browser Back button go to the previous step in a multi-step form.
 *
 * Usage:
 *   useStepBackNav(step, prevStepFn);
 *
 * - step       : current step number (any integer)
 * - prevStepFn : function to call when back is pressed (prevStep / goPrev / handlePrev)
 *
 * How it works:
 *   - On mount: replaces current history entry with a step marker
 *   - On step increase (forward nav): pushes a new history entry
 *   - On popstate (browser back): calls prevStepFn if we're inside the form's history
 *   - When user presses back at step 0/1 (first step): browser naturally leaves the form
 */
export function useStepBackNav(step, prevStepFn) {
  const prevStepFnRef = useRef(prevStepFn);
  useEffect(() => { prevStepFnRef.current = prevStepFn; });

  // Mark initial history entry and attach popstate listener
  useEffect(() => {
    history.replaceState({ __ovika_step: step }, '');

    const handlePop = (e) => {
      if (e.state && typeof e.state.__ovika_step !== 'undefined') {
        prevStepFnRef.current();
      }
      // No marker → browser naturally left the form, do nothing
    };

    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Push new history entry only when step moves FORWARD
  const prevStepRef = useRef(step);
  useEffect(() => {
    if (step > prevStepRef.current) {
      history.pushState({ __ovika_step: step }, '');
    }
    prevStepRef.current = step;
  }, [step]);
}
