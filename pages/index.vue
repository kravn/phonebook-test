<template>
    <v-container fill-height>
        <v-layout fill-height>
            <v-flex fill-height>

                <v-card height="100%"  class="fill-height mx-auto overflow-hidden">

                    <v-card-text class="display-1 text-center pt-4 mt-5">
                        <div class="justify-center">
                            <ContactsLogo />
                        </div>
                        <div class="pt-4">My Contacts</div>
                    </v-card-text>

                    <v-card-actions class="px-4">

                        <v-row class="pr-3 pl-3">
                            <v-col cols="6" class="px-0 mx-0">
                                <v-text-field
                                    v-model="searchKey"
                                    @input="search"
                                    solo-inverted hide-details 
                                    dense flat  
                                    placeholder="Search"
                                    class="pr-2">
                                </v-text-field>
                            </v-col>
                            <v-col cols="6" class="px-0 mx-0">
                                <v-select
                                    v-model="searchType"
                                    :items="searchKeys"
                                    value="value"
                                    text="text"
                                    width="100"
                                    solo-inverted hide-details 
                                    dense flat
                                    placeholder="Search"
                                    class="pr-2">
                                </v-select>
                            </v-col>
                        </v-row>   

                        <AddContact />

                    </v-card-actions>

                    <v-card-text class="py-0">
                        <v-card flat class="mx-auto" height="100%"> 

                            
                            <v-data-table
                                v-if="!showList"
                                :headers="headers"
                                :items="getContacts"
                                :items-per-page="3000"
                                class="elevation-0"
                                hide-default-footer
                                :options.sync="options"
                                :server-items-length="totalContacts"
                                :loading="loading"
                                must-sort>

                                <template v-slot:item.avatar="{ item }">
                                    <v-avatar color="grey darken-3 my-1">
                                        <div class="headline font-weight-bold success--text">
                                            {{ item.first_name | first_letter }}
                                        </div>
                                    </v-avatar>
                                </template>

                                <template v-slot:item.first_name="{ item }">
                                    <p class="ma-0 white--text">{{ item | fullname }}</p>
                                    <p class="ma-0 grey--text">{{ item.phone_number }}</p>
                                </template>

                                <template v-slot:item.created_at="{ item }">
                                    {{ item.created_at | formatDate }}
                                </template>

                                <template v-slot:item.actions="{ item }">
                                    <div class="float-right d-flex">

                                        <UpdateContact
                                            :contact="item"
                                            :action-update="true"
                                            :override="override"
                                            title="Update Contact" />

                                        <DeleteContact
                                            @confirmed="remove"
                                            :selected-object="item"
                                            title="Delete Contact"
                                            :message="`Are you sure you want to remove contact ${item.first_name} ${item.last_name}?`" />

                                        <v-btn 
                                            @click.stop="setFavorite(item)" 
                                            fab x-small depressed
                                            class="ml-1">
                                            <v-icon :color="`${item.favorite ? 'red' : 'grey darken-3'}`">
                                                {{ item.favorite ? 'mdi-heart' : 'mdi-heart-outline' }}
                                            </v-icon>
                                        </v-btn>
                                    </div>
                                </template>

                            </v-data-table>
                        
                            <v-list 
                                v-else
                                style="max-height: 590px"
                                class="overflow-y-auto" 
                                two-line>

                                <v-list-item 
                                    v-for="(contact, index) in getContacts" 
                                    :key="index"
                                    @mouseenter="hovered = index"
                                    @mouseleave="hovered = ''"
                                    @click="openDialog(contact)">
                                    
                                    <v-list-item-avatar color="grey darken-3">
                                        <div class="display-1 font-weight-bold success--text">
                                            {{ contact.first_name | first_letter }}
                                        </div>
                                        <!-- <v-icon color="grey darken-4">mdi-account</v-icon> -->
                                    </v-list-item-avatar>

                                    <v-list-item-content>
                                        <v-list-item-title>
                                            {{ contact | fullname }}
                                        </v-list-item-title>
                                        <v-list-item-subtitle
                                            class="text--gray font-weight-thin"
                                            v-text="contact.phone_number">                                                
                                        </v-list-item-subtitle>
                                    </v-list-item-content>

                                    <v-list-item-action class="px-1 mx-0"
                                        v-show="hovered === index">

                                        <DeleteContact
                                            @confirmed="remove"
                                            :selected-object="contact"
                                            title="Delete Contact"
                                            :message="`Are you sure you want to remove contact ${contact.first_name} ${contact.last_name}?`" />
                                    
                                    </v-list-item-action>

                                    <v-list-item-action class="px-1 mx-0">
                                        <v-btn @click.stop="setFavorite(contact)" fab x-small depressed>
                                            <v-icon :color="`${contact.favorite ? 'red' : 'grey darken-3'}`">
                                                {{ contact.favorite ? 'mdi-heart' : 'mdi-heart-outline' }}
                                            </v-icon>
                                        </v-btn>
                                    </v-list-item-action>
                                        
                                </v-list-item>

                            </v-list>
                        </v-card>
                    </v-card-text>

                </v-card>

                </v-flex>
            </v-layout>
        </v-container>
</template>

<script>

    import { mapActions, mapGetters } from 'vuex'
    import AddContact from '~/components/contact/AddContactDialog'
    import UpdateContact from '~/components/contact/AddContactDialog'
    import DeleteContact from '~/components/shared/ConfirmModal'
    import { debounce } from 'lodash'
    import moment from 'moment'

    export default {
        components: {
            AddContact,
            DeleteContact,
            UpdateContact
        },
        computed: {
            ...mapGetters('contacts', [
                'getContacts',
                'totalContacts'
            ])
        },
        filters: {
            fullname(obj) {
                return `${obj.first_name} ${obj.last_name}`
            },
            first_letter(value) {
                return value[0].toUpperCase()
            },
            formatDate(value) {
                return moment(value).format('MM/DD/YYYY')
            }
        },
        async mounted() {
            await this.fetchContacts()
        },
        methods: {
            ...mapActions('contacts', [
                'fetchContacts',
                'deleteContact',
                'updateFavorite',
                'searchContacts'
            ]),
            async remove(id) {
                await this.deleteContact(id)
            },
            async setFavorite(obj) {
                let payload = Object.assign({}, obj)

                payload.favorite = !payload.favorite

                await this.updateFavorite(payload)
            },
            async openDialog(data) {
                this.selectedContact = data
                this.override = true
            },
            
            search: debounce( async function() {
                this.loading = true
                await this.searchContacts({
                    type: this.searchType,
                    key: this.searchKey
                })
                this.loading = false
            }, 700),
            closeOverride(val) {
                this.override = false
            }
        },
        watch: {
            'options.sortDesc': {
                async handler () {
                    this.loading = true
                    if (this.options.sortBy[0] || this.options.sortDesc[0])
                        await this.searchContacts({
                            type: this.options.sortBy[0],
                            key: '',
                            desc: this.options.sortDesc[0]
                        })
                    this.loading = false
                },
                deep: true,
            },
        },
        data() {
            return {
                selectedContact: {},
                hovered: '',
                override: false,
                searchKey: '',
                searchType: 'phone_number',
                showList: false,
                searchKeys: [
                    { text: 'First Name', value: 'first_name' },
                    { text: 'Last Name', value: 'last_name' },
                    { text: 'Phone Number', value: 'phone_number' }
                ],
                headers: [
                    { text: '', sortable: false, value: 'avatar' },
                    { text: 'Full Name', sortable: true, value: 'first_name' },
                    { text: 'Created', sortable: true, value: 'created_at' },
                    { text: '', sortable: false, value: 'actions' }
                ],
                options: {},
                loading: false,
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>
