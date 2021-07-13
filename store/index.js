import { getField, updateField } from 'vuex-map-fields'

export const state = () => ({
    baseUrl: 'http://localhost:4000',
    notification_settings: {
        snackbar: false,
        color: 'success',
        y: 'top',
        x: null,
        mode: 'multi-line',
        timeout: -1,
        text: 'Default Message!',
        timer: 5000
    }
})

export const getters = {
    getField,
    getApiBase: (state) => {
        return state.baseUrl
    },    
    notification_settings: (state) => state.notification_settings,
}

export const actions = {

}

export const mutations = {
    updateField,
    toggleQuickMessage(state, data) {
        if (state.notification_settings.snackbar) { state.notification_settings.snackbar = false }
        state.notification_settings.snackbar = !state.notification_settings.snackbar
        state.notification_settings.text = data.text
        state.notification_settings.color = data.color
    },
    forceCloseQuickMessage(state) {
        state.notification_settings.snackbar = false
    }
}