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
        },
        mounted() {
            this.callerID.updateList();
        },
    };
</script>