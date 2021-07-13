<template>
    <v-row class="pa-2">
    
        <v-col 
            v-for="contact in getFavoriteContacts" 
            cols="3"
            class="pa-2">
            <v-card flat>
                <v-card-text class="text-center">
                    <v-avatar color="grey darken-3" size="120">
                        <v-icon size="100">mdi-account</v-icon>
                    </v-avatar>
                    <div class="headline font-weight-thin pt-4">
                        {{ contact.first_name }} {{ contact.last_name }}
                    </div>
                    <div class="headline font-weight-medium">
                        {{ contact.phone_number }}
                    </div>
                </v-card-text>
                
                <v-card-actions class="pa-4">
                    <v-btn
                        color="grey darken-3"
                        fab depressed small>
                        <v-icon color="success">mdi-message</v-icon>
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="grey darken-3"
                        fab depressed small>
                        <v-icon color="success">mdi-phone</v-icon>
                    </v-btn>
                </v-card-actions>

            </v-card>  
        </v-col>
        
    </v-row>
</template>

<script>

    import { mapGetters } from 'vuex'
    export default {
        computed: {
            ...mapGetters('contacts', [
                'getFavoriteContacts',
                'getContacts'
            ])
        },
    }
</script>

<style lang="scss" scoped>

</style>