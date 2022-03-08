<template id="accept-user">
	<div v-if="!isSelf && !isService">
	    <form class="u-form callerid-userbox-form">
            <label class="kiwi-user-callerid-label">
                <input v-model="calleridStatus" type="checkbox">
                <span>CallerID whitelist</span>
            </label>
	    </form>
	</div>
</template>

<script>
    export default {
        template: '#accept-user',
        props: ['network', 'buffer', 'user', 'callerID'],
        data() {
            return {
                inProgress: false,
                callerList: [],
                callerCache: [],
            };
        },
        computed: {
            calleridStatus: {
                get() {
                    return this.callerID.hasNick(this.user.nick);
                },
                set(val) {
                    this.network.ircClient.raw('ACCEPT', val ? '+' + this.user.nick : '-' + this.user.nick);
                },
            },
            isSelf() {
                return this.user === this.network.currentUser();
            },
            isService() {
                return this.user.host === kiwi.state.setting('plugin-callerid.ServicesHost');
            },
        },
        mounted() {
            this.callerID.updateList();
        },
    };
</script>