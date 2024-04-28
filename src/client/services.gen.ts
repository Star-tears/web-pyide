// This file is auto-generated by @hey-api/openapi-ts

import type { CancelablePromise } from './core/CancelablePromise';
import { OpenAPI } from './core/OpenAPI';
import { request as __request } from './core/request';
import type { $OpenApiTs } from './types.gen';

export class IdeService {
    /**
     * Ide List Projects
     * @returns ResponseBase Successful Response
     * @throws ApiError
     */
    public static ideIdeListProjects(): CancelablePromise<$OpenApiTs['/api/v1/ide/ide_list_projects']['get']['res'][200]> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/ide/ide_list_projects'
        });
    }
    
    /**
     * Ide Get Project
     * @param data The data for the request.
     * @param data.requestBody
     * @returns ResponseBase Successful Response
     * @throws ApiError
     */
    public static ideIdeGetProject(data: $OpenApiTs['/api/v1/ide/ide_get_project']['post']['req']): CancelablePromise<$OpenApiTs['/api/v1/ide/ide_get_project']['post']['res'][200]> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/ide/ide_get_project',
            body: data.requestBody,
            mediaType: 'application/json',
            errors: {
                422: 'Validation Error'
            }
        });
    }
    
    /**
     * Ide Create Project
     * @param data The data for the request.
     * @param data.requestBody
     * @returns ResponseBase Successful Response
     * @throws ApiError
     */
    public static ideIdeCreateProject(data: $OpenApiTs['/api/v1/ide/ide_create_project']['post']['req']): CancelablePromise<$OpenApiTs['/api/v1/ide/ide_create_project']['post']['res'][200]> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/ide/ide_create_project',
            body: data.requestBody,
            mediaType: 'application/json',
            errors: {
                422: 'Validation Error'
            }
        });
    }
    
    /**
     * Ide Delete Project
     * @param data The data for the request.
     * @param data.requestBody
     * @returns ResponseBase Successful Response
     * @throws ApiError
     */
    public static ideIdeDeleteProject(data: $OpenApiTs['/api/v1/ide/ide_delete_project']['post']['req']): CancelablePromise<$OpenApiTs['/api/v1/ide/ide_delete_project']['post']['res'][200]> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/ide/ide_delete_project',
            body: data.requestBody,
            mediaType: 'application/json',
            errors: {
                422: 'Validation Error'
            }
        });
    }
    
    /**
     * Ide Rename Project
     * @param data The data for the request.
     * @param data.requestBody
     * @returns ResponseBase Successful Response
     * @throws ApiError
     */
    public static ideIdeRenameProject(data: $OpenApiTs['/api/v1/ide/ide_rename_project']['post']['req']): CancelablePromise<$OpenApiTs['/api/v1/ide/ide_rename_project']['post']['res'][200]> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/ide/ide_rename_project',
            body: data.requestBody,
            mediaType: 'application/json',
            errors: {
                422: 'Validation Error'
            }
        });
    }
    
    /**
     * Ide Save Project
     * @param data The data for the request.
     * @param data.requestBody
     * @returns ResponseBase Successful Response
     * @throws ApiError
     */
    public static ideIdeSaveProject(data: $OpenApiTs['/api/v1/ide/ide_save_project']['post']['req']): CancelablePromise<$OpenApiTs['/api/v1/ide/ide_save_project']['post']['res'][200]> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/ide/ide_save_project',
            body: data.requestBody,
            mediaType: 'application/json',
            errors: {
                422: 'Validation Error'
            }
        });
    }
    
    /**
     * Ide Create File
     * @param data The data for the request.
     * @param data.requestBody
     * @returns ResponseBase Successful Response
     * @throws ApiError
     */
    public static ideIdeCreateFile(data: $OpenApiTs['/api/v1/ide/ide_create_file']['post']['req']): CancelablePromise<$OpenApiTs['/api/v1/ide/ide_create_file']['post']['res'][200]> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/ide/ide_create_file',
            body: data.requestBody,
            mediaType: 'application/json',
            errors: {
                422: 'Validation Error'
            }
        });
    }
    
    /**
     * Ide Write File
     * @param data The data for the request.
     * @param data.requestBody
     * @returns ResponseBase Successful Response
     * @throws ApiError
     */
    public static ideIdeWriteFile(data: $OpenApiTs['/api/v1/ide/ide_write_file']['post']['req']): CancelablePromise<$OpenApiTs['/api/v1/ide/ide_write_file']['post']['res'][200]> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/ide/ide_write_file',
            body: data.requestBody,
            mediaType: 'application/json',
            errors: {
                422: 'Validation Error'
            }
        });
    }
    
    /**
     * Ide Get File
     * @param data The data for the request.
     * @param data.requestBody
     * @returns ResponseBase Successful Response
     * @throws ApiError
     */
    public static ideIdeGetFile(data: $OpenApiTs['/api/v1/ide/ide_get_file']['post']['req']): CancelablePromise<$OpenApiTs['/api/v1/ide/ide_get_file']['post']['res'][200]> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/ide/ide_get_file',
            body: data.requestBody,
            mediaType: 'application/json',
            errors: {
                422: 'Validation Error'
            }
        });
    }
    
    /**
     * Ide Delete File
     * @param data The data for the request.
     * @param data.requestBody
     * @returns ResponseBase Successful Response
     * @throws ApiError
     */
    public static ideIdeDeleteFile(data: $OpenApiTs['/api/v1/ide/ide_delete_file']['post']['req']): CancelablePromise<$OpenApiTs['/api/v1/ide/ide_delete_file']['post']['res'][200]> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/ide/ide_delete_file',
            body: data.requestBody,
            mediaType: 'application/json',
            errors: {
                422: 'Validation Error'
            }
        });
    }
    
    /**
     * Ide Rename File
     * @param data The data for the request.
     * @param data.requestBody
     * @returns ResponseBase Successful Response
     * @throws ApiError
     */
    public static ideIdeRenameFile(data: $OpenApiTs['/api/v1/ide/ide_rename_file']['post']['req']): CancelablePromise<$OpenApiTs['/api/v1/ide/ide_rename_file']['post']['res'][200]> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/ide/ide_rename_file',
            body: data.requestBody,
            mediaType: 'application/json',
            errors: {
                422: 'Validation Error'
            }
        });
    }
    
    /**
     * Ide Create Folder
     * @param data The data for the request.
     * @param data.requestBody
     * @returns ResponseBase Successful Response
     * @throws ApiError
     */
    public static ideIdeCreateFolder(data: $OpenApiTs['/api/v1/ide/ide_create_folder']['post']['req']): CancelablePromise<$OpenApiTs['/api/v1/ide/ide_create_folder']['post']['res'][200]> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/ide/ide_create_folder',
            body: data.requestBody,
            mediaType: 'application/json',
            errors: {
                422: 'Validation Error'
            }
        });
    }
    
    /**
     * Ide Delete Folder
     * @param data The data for the request.
     * @param data.requestBody
     * @returns ResponseBase Successful Response
     * @throws ApiError
     */
    public static ideIdeDeleteFolder(data: $OpenApiTs['/api/v1/ide/ide_delete_folder']['post']['req']): CancelablePromise<$OpenApiTs['/api/v1/ide/ide_delete_folder']['post']['res'][200]> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/ide/ide_delete_folder',
            body: data.requestBody,
            mediaType: 'application/json',
            errors: {
                422: 'Validation Error'
            }
        });
    }
    
    /**
     * Ide Rename Folder
     * @param data The data for the request.
     * @param data.requestBody
     * @returns ResponseBase Successful Response
     * @throws ApiError
     */
    public static ideIdeRenameFolder(data: $OpenApiTs['/api/v1/ide/ide_rename_folder']['post']['req']): CancelablePromise<$OpenApiTs['/api/v1/ide/ide_rename_folder']['post']['res'][200]> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/ide/ide_rename_folder',
            body: data.requestBody,
            mediaType: 'application/json',
            errors: {
                422: 'Validation Error'
            }
        });
    }
    
    /**
     * Get Python Pkg Installed List
     * @returns ResponseBase Successful Response
     * @throws ApiError
     */
    public static ideGetPythonPkgInstalledList(): CancelablePromise<$OpenApiTs['/api/v1/ide/get_python_pkg_installed_list']['get']['res'][200]> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/ide/get_python_pkg_installed_list'
        });
    }
    
}