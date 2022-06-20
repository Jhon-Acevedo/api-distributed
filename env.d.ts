declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_CONN_STRING: string;
      DB_NAME: string;
      SUBJECT_COLLECTION_NAME: string;
      REGISTRATION_COLLECTION_NAME: string;
      STUDENT_COLLECTION_NAME: string;
    }
  }
}

export {};
