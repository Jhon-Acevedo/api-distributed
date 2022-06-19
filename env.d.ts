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

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
