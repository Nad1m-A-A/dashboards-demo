/** Shared page shell for dashboard list pages (cards + scrollable tables). */
export const dashboardPageClasses =
    'flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4';

/** Horizontal scroll container for wide table sections. */
export const dashboardTableScrollClasses = 'overflow-x-auto';

/** Inner content that grows with table width while filling the viewport. */
export const dashboardTableScrollContentClasses = 'w-max min-w-full';

/** Bordered table frame used inside scroll areas. */
export const dashboardTableFrameClasses =
    'w-full overflow-hidden rounded-md border';
