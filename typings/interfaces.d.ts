declare module HdiUtil {

    /**
     * Describes options that can be passed to the create image method
     */
    interface IICreateOptions {
        /**
         * Specify a particular type of encryption or, if not specified, the default encryption algorithm
         * Format: AES-128|AES-256
         */
        encryption: string;
        /**
         * Specify the size of the image
         * Format: ??b|??k|??m|??g|??t|??p|??e
         */
        size: string;
        /**
         * Specify the size of the image file in 512-byte sectors.
         */
        sectors: string;
        /**
         * Causes a filesystem of the specified type to be written to the image.
         * fs is invalid and ignored when using srcdevice.
         * Format: HFS+|HFS+J|HFSX|JHFS+X|MS-DOS|UDF
         */
        fs: string;
        /**
         * The newly-created filesystem will be named volname
         */
        volname: string;
        /**
         * Copies file-by-file the contents of source into the image.
         */
        srcfolder: string;
        /**
         * Specifies that the blocks of device should be used to create a new image
         */
        srcdevice: string;
        /**
         * Attach the image after creating it.
         */
        attach: boolean;
        /**
         * The password for the encrypted image.
         */
        password: string;
        /**
         * Specify the format of empty read/write images
         * Format: UDIF|SPARSE|SPARSEBUNDLE
         */
        type: string;
    }

    /**
     * Describes options that can be passed to the attach image method
     */
    interface IAttachOptions {
        /**
         * Indicate whether filesystems in the image should be mounted.
         */
        mountpoint: string;
        /**
         * Force the resulting device to be read-only.
         */
        readonly: boolean;
        /**
         * The password for the encrypted image.
         */
        password: string;
        /**
         * Render any volumes invisible in applications such as the OS X Finder.
         */
        nobrowse: boolean;
        /**
         * Auto-open volumes (in the Finder) after attaching an image.
         */
        autoopen: boolean
    }

    interface IIImageInfo {
        /**
         * The absolute mount path.
         */
        mountPath: string;
        /**
         * The absolute path of the image.
         */
        devicePath: string;
        /**
         * Indicate whether the image is encrypted or not.
         */
        encrypted: string;
        /**
         * Specify the format of image.
         */
        imageType: string;
    }

    interface IHdiUtil {
        /**
         * Return information about the disk image driver, throw error if the image is not attached.
         *
         * @param {string} imagePath - absolute or relative path to the image.
         * @returns {Promise<IImageInfo>} the summary of the image info.
         */
        info(imagePath: string): Promise<IImageInfo>;

        /**
         * Return information about the  image driver encryption.
         *
         * @param {string} imagePath - absolute or relative path to the image.
         * @returns {Promise<boolean>} indicate whether the image is encrypted or not.
         */
        isEncrypted(imagePath: string): Promise<boolean>;

        /**
         * Attach a disk image as a device
         *
         * @param {string} imagePath - absolute or relative path to the image.
         * @param {IAttachOptions} imagePath - attach options.
         * @returns {Promise<any>} return information about an already-attached image as if it had attached it.
         */
        attach(imagePath: string, options: IAttachOptions): Promise<any>;

        /**
         * Detach a disk image and terminate any associated process.
         *
         * @param {string} imagePath - absolute or relative path to the image.
         * @param {boolean} force - ignore open files on mounted volumes, etc.
         * @returns {Promise<void>}
         */
        detach(imagePath: string, force: boolean): Promise<void>;

        /**
         * Create a new image of the given size or from the provided data.
         *
         * @param {string} imagePath - absolute or relative path to the image.
         * @param {ICreateOptions} imagePath - create options.
         * @returns {Promise<String>[]} absolute path to the image.
         * @api public
         */
        create(imagePath: string, options: ICreateOptions): Promise<String>[];
    }
}
