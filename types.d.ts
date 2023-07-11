export type Manager = {
    [index: string]: CallableFunction
};

export type StdObject = {
    [index: string]: any
}

export type CmdoArgs = {
    Interaction: CommandInteraction
}

export type SelectMenuArgs = {
    Interaction: SelectMenuInteraction
}

export type ModalArgs = {
    Interaction: ModalSubmitInteraction
}

export type Tasks = 'mission'|'report'|'tower'|'train'|'adventure'|'daily'|'vote'|'weekly'|'challenge'|'quest'|'null';

export type TimeoutStore = {
    [index: string]: NodeJS.Timeout
}

export type ProUser = {
    userId: string,
    username: string
    mission: number,
    report: number,
    challenge: number
}