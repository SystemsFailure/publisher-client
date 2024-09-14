export const handleError = (error) => {
  console.error('Error:', error);
  alert("Произошла ошибка при выполнении запроса.");
};

export const fetchData = async (http, path) => {
  try {
    const response = await http.get(path);
    if (response.data && response.data.autoloads) {
      return response.data.autoloads;
    } else {
      throw new Error("Неверный формат данных");
    }
  } catch (error) {
    handleError(error);
    throw error;
  }
};

export const startUpload = async (http, path, data) => {
  try {
    const response = await http.post(path, { ...data });
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

export const changeStatus = async (http, id) => {
  try {
    const response = await http.put(`/update-status/${id}`);
    if (!response.data) return false;
    if (response.data.status === 'success') return true;
  } catch (error) {
    handleError(error);
    throw error;
  }
}