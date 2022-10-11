import { Data } from "@entities"
import { Database, Stats } from "@services"
import { Controller, Get } from "@tsed/common"
import { BaseController } from "@utils/classes"
import { waitForDependencies } from "@utils/functions"
import { Client } from "discordx"

@Controller('/health')
export class HealthController extends BaseController {

    private client: Client
    private db: Database
    private stats: Stats

    constructor() {
        super()

        waitForDependencies([Client, Database, Stats]).then(([client, db, stats]) => {
            this.client = client
            this.db = db
            this.stats = stats
        })
    }

    @Get('/check')
    async healthcheck() {

        return {
            online: this.client.user?.presence.status !== 'offline',
            uptime: this.client.uptime,
            lastStartup: await this.db.get(Data).get('lastStartup'),
        }
    }

    @Get('/latency')
    async latency() {

        return this.stats.getLatency()
    }

    @Get('/usage')
    async usage() {

        const body = await this.stats.getPidUsage()
    
        return body
    }

    @Get('/host')
    async host() {

        const body = await this.stats.getHostUsage()

        return body
    }
}