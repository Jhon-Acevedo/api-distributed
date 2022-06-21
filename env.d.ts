declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_CONN_STRING: string;
      DB_NAME: string;
      SUBJECT_COLLECTION_NAME: string;
      REGISTRATION_COLLECTION_NAME: string;
      STUDENT_COLLECTION_NAME: string;
      API_BASE_URL: string;
      API_SUBJECTS_URL: string;
      API_REGISTRATIONS_URL: string;
      API_STUDENTS_URL: string;
    }
  }
}

export {};
