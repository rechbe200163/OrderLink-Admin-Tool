export type FormState = {
  success: boolean;
  message?: string;
  data?: string | number;
  errors?: {
    title: string[];
  };
};
