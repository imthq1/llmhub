import apiClient from './api/axiosClient'

const authService = {
  async loginWithGoogleCode(code) {
    const { data } = await apiClient.get('/login/oauth2/code/google', { params: { code } })
    return data
  },
}

export default authService
