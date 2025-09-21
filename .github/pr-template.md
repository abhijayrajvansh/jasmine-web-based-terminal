## feat: enhanced user restore with role select

### about this pr

- adds role select dialog to user restore panel for fixing users with invalid 'user' roles, giving admins better control over assignments.

### key changes

* added interactive role select dialog
* 4 roles: user, driver, admin, manager
* visual feedback with validation
* audit trail for previous role
* loading + error states

### new feat

* role select with 4 options
* validation + feedback
* firestore update with audit log

### screenshot
[INSERT SUBMITTED SCREENSHOTS BY USER OF THE CHANGE FOR REFERENCE]