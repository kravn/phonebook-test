<template>
    <v-snackbar 
        v-model="settings.snackbar"
        :color="settings.color"
        :top="settings.y === 'top'"
        :bottom="settings.y === 'bottom'"
        :left="settings.x === 'left'"
        :right="settings.x === 'right'"
        :timeout="settings.timeout"
        :vertical="settings.mode === 'vertical'"
        :multi-line="settings.mode === 'multi-line'">
        {{ settings.text }}
        <v-btn fab depressed :color="settings.color"
            @click="close">
            <v-icon small>mdi-close</v-icon>
        </v-btn>
    </v-snackbar>
</template>

<script>

    import { mapMutations } from 'vuex'
    import { mapFields } from 'vuex-map-fields'

    export default {
        name: 'Snackbar',

        computed: {
            ...mapFields({ settings: 'notification_settings' })
        },

        methods: {
            ...mapMutations( ['forceCloseQuickMessage']),
            close() {
                this.forceCloseQuickMessage()
            }
        },

        watch: {
            'settings.snackbar': {
                handler(val) {
                    let _s = this
                    if (val == true) {
                        setTimeout( () => {
                            this.forceCloseQuickMessage()                            
                        }, this.settings.timer)
                    }
                },
                deep: true
            }
        }
    }
    
</script>

<style lang="scss" scoped>

</style>