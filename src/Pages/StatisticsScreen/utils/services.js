import { getCategories } from '../../../Services/Axios/demandsServices';

const getCategoriesFromApiService = async (startModal) => {
  try {
    const res = await getCategories('category', startModal);
    return res.data;
  } catch (error) {
    console.error(`An unexpected error ocourred while getting categories.${error}`);
    return error;
  }
};

export default getCategoriesFromApiService;
