export type FormState = {
  success: boolean;
  message?: string | null;
  data?: any;
  errors?: {
    title: string[];
  };
};
