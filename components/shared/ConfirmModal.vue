<template>
    <div class="text-center">
        <v-dialog
            v-model="dialog"
            width="500"
            persistent>

            <template v-slot:activator="{ on, attrs }">
                <v-btn 
                    fab x-small depressed
                    nuxt class="ml-2 float-right"
                    v-bind="attrs"
                    v-on="on">
                    <v-icon
                        small
                        color="error darken-2">
                        mdi-delete
                    </v-icon>
                </v-btn>
            </template>

            <v-card dark>

                <v-card-actions class="py-4">
                    <div class="text-h5">{{ title }}</div>
                    <v-spacer></v-spacer>
                    <v-btn
                        @click="dialog = false"
                        fab depressed x-small>
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-actions>
                
                <v-card-text ref="form" class="pt-4">
                    <div class="body-2 font-weight-light">
                        {{ message }}
                    </div>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                     <v-btn
                        color="error"
                        text
                        @click="dialog = false">
                        No
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="success"
                        text
                        @click="confirm">
                        Yes, delete it!
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    export default {
        props: {
            title: {
                type: String,
                default: 'Are you sure?'
            },
            message: {
                type: String,
                default: 'Please confirm action to proceed.'
            },
            selectedObject: {
                type: Object,
                default: () => {}
            }
        },
        methods: {
            confirm() {
                this.$emit('confirmed', this.selectedObject.id)
                this.dialog = false
            }
        },
        data() {
            return {
                dialog: false
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>