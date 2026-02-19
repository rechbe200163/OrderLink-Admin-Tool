export type FormState = {
  success: boolean;
  message?: string;
  data?: any;
  errors?: {
    title: string[];
  };
};
