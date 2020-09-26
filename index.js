const nkv = require("nkv.db");
const fdWrapper = require("fd-wrapper");
/**
 * Pass in your client object.
 * @param {Discord.Client} client Your client object.
 * @param {Object} defaults Defaults for data per-guild.
 * @param {string} database Database name for `nkv.db`, reuse the same db as your main project if you want to.
 * @returns
 */
function guildData(client, options = {}, database = "guildData") {
	const db = new nkv.Database("guild_data", database);
	client.once("ready", () => {
		client.guilds.cache.forEach((guild) => {
			if (!db.has(guild.id)) {
				db.set(guild.id, options);
			}
		});
		db.all().forEach((row) => {
			if (!client.guilds.cache.has(row.key)) {
				db.remove(row.key);
			}
		});
	});
	client.on("guildCreate", (guild) => {
		db.set(guild.id, options);
	});
	client.on("guildDelete", (guild) => {
		db.remove(guild.id);
	});
	/**
	 * @param {string} id Id of the requested guild.
	 * @example ```js
	 * // `client` is your Discord Client object.
	 * const guilds = require("guild-data")(client, {prefix: ".", premium: false})
	 * //...
	 * client.on("message", (message) => {
	 * 		if(!message.guild) return;
	 *   	const gld = guilds(message.guild.id);
	 * 	 	if(!message.content.startsWith(gld.prefix)) return;
	 * 	 	if(gld.premium) {
	 * 			// code
	 *   	}
	 * });
	 * ```
	 * @returns
	 */
	function getGuild(id) {
		return fdWrapper({
			cache: (function () {
				if (db.has(id)) {
					return db.get(id);
				} else {
					db.set(id, options);
					return options;
				}
			})(),
			save() {
				db.set(id, this.cache);
			},
			set(key, value) {
				this.cache[key] = value;
				save();
			},
			get(key) {
				if (key === "save") return this.save;
				return this.cache[key];
			},
			has(key) {
				return this.cache.hasOwnProperty(key);
			},
		});
	}
	return getGuild;
}

module.exports = guildData;
