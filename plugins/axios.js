export default async function ({ store, $axios, $auth, redirect }, inject) {

    // Set default, to be used by Auth Module
    // $axios.defaults.baseURL = store.getters['slug/getApiDomain']

    // console.log('199 :>> ', store.getters['getApiBase']);

    const api = $axios.create({
        baseURL: 'http://localhost:4000/',
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        } 
    })

    api.interceptors.response.use(
        (response) => {
            return response
        },
        (error) => {
            return error.response
        }
    )

    inject('api', api)
}