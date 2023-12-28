type FormDataErrors = {
  name?: string | null;
  email?: string | null;
  confirm_password?: string | null;
  userExist?: string | null;
  wrongPassword?: string | null;
  userId?: string | null;
};

type AddTaskFormErrors = {
  title?: string | null;
  description?: string | null;
  success?: string | null;
};

type UpdateTaskFormErrors = {
  title?: string | null;
  description?: string | null;
};

type UpdateUserProfileErrors = {
  nameError?: string | null;
  imageError?: string | null;
};
