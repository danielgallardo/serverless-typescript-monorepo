type Params = {
  name: string;
}

export const getGreeting = async ({name}: Params) => {
  return {
    message: `Hello ${name}! Welcome to Serverless`
  }
};
