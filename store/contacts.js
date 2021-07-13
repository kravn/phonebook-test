export const state = () => ({
    contacts: []
})

export const getters = {
    getContacts: (state) => {
        return state.contacts
    },
    getFavoriteContacts: (state) => {
        return state.contacts.filter( contact => {
            return contact.favorite === true
        })
    },
    totalContacts: (state) => {
        return state.contacts.length
    }
}

export const actions = {
    async fetchContacts({commit}, params = {}) {
        let response = await this.$api.get(`contacts?_sort=created_at&_order=desc`)
        
        if ( response.status === 200 ) {
            commit('onOkGetContacts', response.data)
        }
    },
    async searchContacts({commit}, params = {}) {
        let response = await this.$api.get(`contacts?${params.type}_like=${params.key}&_sort=${params.type}&_order=${params.desc ? 'desc' : 'asc'}`)
        
        if ( response.status === 200 ) {
            commit('onOkGetContacts', response.data)
        }
    },
    async createContact({commit}, body = {}) {
        let response = await this.$api.post(`contacts`, body)
        console.log('response :>> ', response);
        if ( response.status === 201 ) {
            commit('onOkAddContact', response.data)
        }
    },
    async updateContact({commit}, body = {}) {
        let response = await this.$api.patch(`contacts/${body.id}`, body)

        if ( response.status === 200 ) {
            commit('onOkUpdateContact', response.data)
        }
    },
    async updateFavorite({commit}, body = {}) {
        let response = await this.$api.patch(`contacts/${body.id}`, body)

        if ( response.status === 200 ) {
            commit('onOkUpdateFavorite', response.data)
        }
    },
    async deleteContact({commit}, id = '') {
        let response = await this.$api.delete(`contacts/${id}`)
        
        if ( response.status === 200 ) {
            commit('onOkRemoveContact', id)
        }
    }
}

export const mutations = {
    onOkGetContacts(state, data) {
        state.contacts = data
    },
    onOkAddContact(state, data) {
        state.contacts.push(data)
    },
    onOkRemoveContact(state, data) {
        let newContacts = state.contacts.filter( contact => {
            return contact.id !== data
        })
        state.contacts = newContacts
    },
    onOkUpdateContact(state, data) {
        
        const newContacts = state.contacts.map( contact => 
            contact.id === data.id ? data : contact
        )
        
        state.contacts = newContacts

    },
    onOkUpdateFavorite(state, data) {
        
        const newContacts = state.contacts.map( contact => 
            contact.id === data.id ? {
                ...contact, favorite: data.favorite
            } : contact
        )
        
        state.contacts = newContacts

    }
}