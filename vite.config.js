//@ts-ignore
/** @type {import('vite').UserConfig} */
export default {

    resolve: {
        alias: {
            '@': '/src',
            '@player': '/src/entities/unit/player',
        }
    }
}