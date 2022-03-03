<template id="accept-user">
	<div>
	    <span>
            <label class="kiwi-user-callerid-label">
                
                <input v-model="calleridStatus" type="checkbox">
                <span>Caller ID Whitelist</span>
            </label>
	    </span>
	</div>
</template>

<script>
    export default {
        template: '#accept-user',
        data() {
            return {
                network: null,
                inProgress: false,
                callerList: [],
                callerCache: [],
            };
        },
        computed: {
            calleridStatus: {
                get() {   
                    if (this.$el.kiwi.user in this.callerCache ) {
                        return true;
                    } else {
                        return false;
                    }
                    return
                },
                set(val) {
                    let network = kiwi.state.getActiveNetwork();
                    network.ircClient.raw('ACCEPT', val ? '+' + this.$el.kiwi.user : '-' + this.$el.kiwi.user);
                },
            },            
        },
        mounted() {
            this.network = kiwi.state.getActiveNetwork();
            this.getAllowList();
        },
        beforeDestroy() {
            kiwi.off('irc.raw.281', this.handle281);
            kiwi.off('irc.raw.282', this.handle282);
        },
        methods: {
            getAllowList() {
                if (this.inProgress) {
                    return;
                }
 
                this.inProgress = true;
                this.callerCache = [];
                kiwi.on('irc.raw.281', this.handle281);
                kiwi.on('irc.raw.282', this.handle282);
                this.network.ircClient.raw('ACCEPT', '*');
            },
            handle281(command, event, network) {
                //console.log('irc.raw.281', event);
                this.callerCache.push(event.params[1]);
            },
            handle282(command, event, network) {
                //console.log('irc.raw.282', event);
                kiwi.off('irc.raw.281', this.handle281);
                kiwi.off('irc.raw.282', this.handle282);
                this.callerList = this.callerCache;
                this.inProgress = false;
                this.callerCache = [];
            },
        },

    };
</script>