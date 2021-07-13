<template>
    <div class="text-center">
        <v-dialog
            v-model="dialog"
            width="500"
            persistent>

            <template v-if="!noActivator" v-slot:activator="{ on, attrs }">
                <v-btn
                    v-if="actionUpdate"
                    nuxt depressed fab
                    x-small
                    v-bind="attrs"
                    v-on="on"
                    class="ma-0 pa-0">
                    <v-icon small color="success">mdi-pencil</v-icon>
                </v-btn>
                <v-btn
                    v-else
                    color="primary"
                    nuxt depressed
                    v-bind="attrs"
                    v-on="on">
                    +
                    <v-icon>mdi-account</v-icon>
                </v-btn>
            </template>

            <v-card dark class="grey darken-3">

                <v-progress-linear
                    v-if="loading" 
                    indeterminate 
                    color="cyan">
                </v-progress-linear>

                <v-card-actions class="py-4">
                    <div class="text-h5">{{ title }}</div>
                    <v-spacer></v-spacer>
                    <v-btn
                        @click="dialog = false"
                        fab depressed x-small>
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-actions>
                
                <v-card-text ref="form" class="pt-10">
                    <v-text-field
                        v-model="resources.first_name"
                        ref="first_name"
                        required
                        :rules="[() => !!resources.first_name || 'First Name is required']"
                        solo-inverted flat
                        label="First Name"
                        placeholder="First Name"></v-text-field>
                    <v-text-field
                        v-model="resources.last_name"
                        ref="last_name"
                        required
                        :rules="[() => !!resources.last_name || 'Last Name is required']"
                        solo-inverted flat
                        label="Last Name"
                        placeholder="Last Name"></v-text-field>
                    <v-text-field
                        v-model="resources.phone_number"
                        ref="phone_number"
                        required
                        :rules="[() => !!resources.phone_number || 'Phone Number is required']"
                        solo-inverted flat
                        label="Phone Number"
                        placeholder="Phone Number"></v-text-field>  
                    <v-switch
                        v-model="resources.favorite"
                        ref="favorite"
                        flat
                        label="Add as Favorite"
                        ></v-switch>  
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        v-if="!override"
                        color="success"
                        text
                        @click="submit">
                        Save
                    </v-btn>
                    <v-btn
                        v-else-if="override"
                        color="success"
                        text
                        @click="submit">
                        Update
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>

    import { mapActions, mapGetters } from 'vuex'
    import { PhoneNumberUtil, PhoneNumberFormat } from 'google-libphonenumber'

    export default {
        props: {
            contact: {
                type: Object,
                default: () => {}
            },
            override: {
                type: Boolean,
                default: false
            },
            noActivator: {
                type: Boolean,
                default: false
            },
            title: {
                type: String,
                default: 'Add New Contact'
            },
            actionUpdate: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            ...mapGetters('contacts', [
                'getContacts'
            ]),
            isNewRecord() {
                return this.props?.id ? false : true
            }
        },
        methods: {
            ...mapActions('contacts', [
                'createContact',
                'updateContact',
                'deleteContact'
            ]),
            async submit() {
                this.hasErrors = false

                Object.keys(this.resources).forEach(f => {
                    if (!this.resources[f] && f !== 'favorite') 
                        this.hasErrors = true

                    if ( f !== 'id' && f !== 'created_at' )
                        this.$refs[f].validate(true)
                })

                if (!this.hasErrors) {

                    let valid = this.validatePhone(this.resources.phone_number)

                    let phoneFound =  this.getContacts.find( contact => {
                        return contact.phone_number === this.resources.phone_number
                    })

                    if (valid) {

                        this.resources.phone_number = valid

                        if (!phoneFound) {
                            
                            if (this.contact) {
                                await this.update()
                            }
                            else {
                                await this.save()
                            }
                                                    
                        }
                        else {
                            
                            if (this.contact) {
                                if (this.contact.phone_number === phoneFound.phone_number)
                                    await this.update()
                                else if (this.contact.id === phoneFound.id)
                                    await this.update()
                                else 
                                    this.$store.commit('toggleQuickMessage',  { text: 'Phone number is already used. Please try again...', color: 'error'})
                                
                            }
                            else {                                
                                this.$store.commit('toggleQuickMessage',  { text: 'Phone number already exist in our database. Please input another number...', color: 'error'})                                
                            }
                            
                        }

                    }
                    else {
                        this.$store.commit('toggleQuickMessage',  { text: 'Must be a valid (E164) US phone number... Please try again!', color: 'error'})
                    }
                    
                }
            },
            async save() {
                this.loading = true
                await this.createContact(this.resources)
                this.loading = false
                this.dialog = false
            },
            async update() {
                this.loading = true
                await this.updateContact(this.resources)
                this.loading = false
                this.dialog = false
            },
            validatePhone(value = '') {
                
                // 202-456-1414 sample format US
                const PNF = PhoneNumberFormat
                const phoneUtil = PhoneNumberUtil.getInstance();
                const number = phoneUtil.parseAndKeepRawInput(value, 'US')
                // const number = phoneUtil.format(value, PNF.E164)

                // console.log('100 :>> ', phoneUtil.format(number, PNF.E164));
                // console.log('200 :>> ', phoneUtil.parseAndKeepRawInput(phoneUtil.format(number, PNF.E164)), 'US');

                let validPhone = phoneUtil.isValidNumber(number) ? phoneUtil.format(number, PNF.E164) : false

                console.log('validPhone :>> ', validPhone)
                return validPhone

            },
            fillLocalResource() {
                this.resources = {
                    first_name: this.contact.first_name,
                    last_name: this.contact.last_name,
                    phone_number: this.contact.phone_number,
                    favorite: this.contact.favorite,
                    id: this.contact.id,
                    created_at: new Date()
                }
            },
        },
        watch: {
            'override': {
                handler(val) {
                    if (val) {                        
                        this.dialog = true
                        this.fillLocalResource()                        
                    }
                }, deep: true
            },
            dialog(val) {
                if (val === false) {
                    this.$emit('closed-override', false)

                    if ( this.noActivator === false ) {
                        this.resources = {
                            first_name: '',
                            last_name: '',
                            phone_number: '',
                            favorite: '',
                            created_at: new Date()
                        }

                    }

                }
                else {
                    if (this.contact) {
                        this.fillLocalResource()
                    }
                }
                
            }
        },
        data() {
            return {
                dialog: false,
                loading: false,
                hasErrors: false,
                resources: {
                    first_name: '',
                    last_name: '',
                    phone_number: '',
                    favorite: false,
                    created_at: new Date()
                }
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>