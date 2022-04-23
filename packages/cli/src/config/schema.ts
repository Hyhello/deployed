// schema json文件，后面计划添加到schemastore
export default {
	type: 'object',
	required: ['projectName', 'modeList'],
	properties: {
		projectName: {
			type: 'string',
			minLength: 1
		},
		cluster: {
			type: 'array',
			uniqueItems: true,
			items: {
				type: 'string'
			}
		},
		privateKey: {
			type: ['string', 'object']
		},
		passphrase: {
			type: 'string',
			minLength: 1
		},
		script: {
			type: 'string',
			minLength: 1
		},
        backupName: {
			type: 'string',
			minLength: 1
		},
		removeLocalDir: {
			type: 'boolean'
		},
		clearRemoteDir: {
			type: 'boolean'
		},
		modeList: {
			type: 'array',
			minItems: 1,
			uniqueItems: true,
			items: {
				type: 'object',
				required: ['mode', 'name', 'host', 'port', 'username', 'localPath', 'remotePath'],
				properties: {
					mode: {
						type: 'string',
						minLength: 1
					},
					name: {
						type: 'string',
						minLength: 1
					},
                    script: {
						type: 'string',
						minLength: 1
					},
					host: {
						type: 'string',
						minLength: 1
					},
					port: {
						type: 'integer',
						minimum: 1
					},
					username: {
						type: 'string',
						minLength: 1
					},
					password: {
						type: 'string',
						minLength: 1
					},
					remotePath: {
						type: 'string',
						minLength: 2
					},
					privateKey: {
						type: ['string', 'object']
					},
					passphrase: {
						type: 'string',
						minLength: 1
					},
					localPath: {
						type: 'string',
						minLength: 1
					},
                    backupName: {
                        type: 'string',
                        minLength: 1
                    },
					backupPath: {
						type: 'string',
						minLength: 2
					},
					removeLocalDir: {
						type: 'boolean'
					},
					clearRemoteDir: {
						type: 'boolean'
					}
				}
			}
		}
	}
};
