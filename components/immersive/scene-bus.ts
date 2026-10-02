/** Mutable scene inputs. Written by DOM listeners, read inside the WebGL frame loop. */
export const sceneBus = {
  scroll: 0,
  px: 0,
  py: 0,
  boot: 0,
  /** Completed days / total. 0 until the progress store hydrates. */
  mastery: 0,
  visible: true,
  mobile: false,
};
