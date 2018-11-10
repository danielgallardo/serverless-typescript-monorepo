import {getEnv} from '../../common/validation';

type Params = {
  message: string;
}

export const postEcho = async ({message}: Params) => {
  const currentStage = getEnv('CURRENT_STAGE');
  const currentRegion = getEnv('AWS_REGION');
  return {
    currentStage,
    currentRegion,
    message
  }
};
