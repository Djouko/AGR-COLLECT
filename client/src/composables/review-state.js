import { always } from 'ramda';

const icons = new Map()
  .set(null, 'icon-dot-circle-o')
  .set('hasIssues', 'icon-comments')
  .set('edited', 'icon-pencil')
  .set('approved', 'icon-check-circle')
  .set('rejected', 'icon-times-circle');
const reviewStates = [...icons.keys()];
icons.set('received', icons.get(null));

export default always({
  reviewStates,
  // Most components should use the SubmissionReviewState component instead of
  // this function. This function returns the icon class for the review state,
  // but it doesn't style the icon. For example, it doesn't specify a color for
  // the icon.
  reviewStateIcon: (reviewState) => icons.get(reviewState)
});
