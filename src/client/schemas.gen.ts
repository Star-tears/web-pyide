// This file is auto-generated by @hey-api/openapi-ts

export const $CreateFileItem = {
    properties: {
        projectName: {
            type: 'string',
            title: 'Projectname'
        },
        parentPath: {
            type: 'string',
            title: 'Parentpath'
        },
        fileName: {
            type: 'string',
            title: 'Filename'
        }
    },
    type: 'object',
    required: ['projectName', 'parentPath', 'fileName'],
    title: 'CreateFileItem'
} as const;

export const $CreateFolderItem = {
    properties: {
        projectName: {
            type: 'string',
            title: 'Projectname'
        },
        parentPath: {
            type: 'string',
            title: 'Parentpath'
        },
        folderName: {
            type: 'string',
            title: 'Foldername'
        }
    },
    type: 'object',
    required: ['projectName', 'parentPath', 'folderName'],
    title: 'CreateFolderItem'
} as const;

export const $DeleteFolderItem = {
    properties: {
        projectName: {
            type: 'string',
            title: 'Projectname'
        },
        folderPath: {
            type: 'string',
            title: 'Folderpath'
        }
    },
    type: 'object',
    required: ['projectName', 'folderPath'],
    title: 'DeleteFolderItem'
} as const;

export const $FileItem = {
    properties: {
        projectName: {
            type: 'string',
            title: 'Projectname'
        },
        filePath: {
            type: 'string',
            title: 'Filepath'
        }
    },
    type: 'object',
    required: ['projectName', 'filePath'],
    title: 'FileItem'
} as const;

export const $HTTPValidationError = {
    properties: {
        detail: {
            items: {
                '$ref': '#/components/schemas/ValidationError'
            },
            type: 'array',
            title: 'Detail'
        }
    },
    type: 'object',
    title: 'HTTPValidationError'
} as const;

export const $ProjItem = {
    properties: {
        projectName: {
            type: 'string',
            title: 'Projectname'
        }
    },
    type: 'object',
    required: ['projectName'],
    title: 'ProjItem'
} as const;

export const $ProjReNameItem = {
    properties: {
        oldName: {
            type: 'string',
            title: 'Oldname'
        },
        newName: {
            type: 'string',
            title: 'Newname'
        }
    },
    type: 'object',
    required: ['oldName', 'newName'],
    title: 'ProjReNameItem'
} as const;

export const $ReNameItem = {
    properties: {
        projectName: {
            type: 'string',
            title: 'Projectname'
        },
        oldPath: {
            type: 'string',
            title: 'Oldpath'
        },
        newName: {
            type: 'string',
            title: 'Newname'
        }
    },
    type: 'object',
    required: ['projectName', 'oldPath', 'newName'],
    title: 'ReNameItem'
} as const;

export const $ResponseBase = {
    properties: {
        type: {
            anyOf: [
                {
                    type: 'string'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Type',
            default: 'response'
        },
        id: {
            anyOf: [
                {
                    type: 'integer'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Id'
        },
        code: {
            type: 'integer',
            title: 'Code',
            default: 0
        },
        data: {
            title: 'Data'
        }
    },
    type: 'object',
    required: ['data'],
    title: 'ResponseBase'
} as const;

export const $SaveProjItem = {
    properties: {
        projectName: {
            type: 'string',
            title: 'Projectname'
        },
        expendKeys: {
            items: {},
            type: 'array',
            title: 'Expendkeys'
        },
        openList: {
            items: {},
            type: 'array',
            title: 'Openlist'
        },
        selectFilePath: {
            type: 'string',
            title: 'Selectfilepath'
        }
    },
    type: 'object',
    required: ['projectName', 'expendKeys', 'openList', 'selectFilePath'],
    title: 'SaveProjItem'
} as const;

export const $ValidationError = {
    properties: {
        loc: {
            items: {
                anyOf: [
                    {
                        type: 'string'
                    },
                    {
                        type: 'integer'
                    }
                ]
            },
            type: 'array',
            title: 'Location'
        },
        msg: {
            type: 'string',
            title: 'Message'
        },
        type: {
            type: 'string',
            title: 'Error Type'
        }
    },
    type: 'object',
    required: ['loc', 'msg', 'type'],
    title: 'ValidationError'
} as const;

export const $WriteFileItem = {
    properties: {
        projectName: {
            type: 'string',
            title: 'Projectname'
        },
        filePath: {
            type: 'string',
            title: 'Filepath'
        },
        fileData: {
            type: 'string',
            title: 'Filedata'
        },
        complete: {
            anyOf: [
                {
                    type: 'boolean'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Complete',
            default: false
        },
        line: {
            anyOf: [
                {
                    type: 'integer'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Line'
        },
        column: {
            anyOf: [
                {
                    type: 'integer'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Column'
        }
    },
    type: 'object',
    required: ['projectName', 'filePath', 'fileData'],
    title: 'WriteFileItem'
} as const;