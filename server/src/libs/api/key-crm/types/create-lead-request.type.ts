export type TCreateLeadRequest = {
  contact: {
    full_name: string;
    phone: string;
    email?: string;
  };
  manager_comment?: string;
  utm_campaign?: string;
  utm_medium?: string;
  utm_content?: string;
  utm_term?: string;
  utm_source?: string;
  source_id?: number;
};
