# Ошибки

1. Устанавливаю пакеты `npm i`, запускаю по **F5** дебаг. VS Code сообщает о 2 ошибках в файле `server.ts`:

    - `Argument of type '(params: InitializeParams) => { capabilities: { textDocumentSync: string; }; }' is not assignable to parameter of type 'RequestHandler<InitializeParams, InitializeResult, InitializeError>'. Types of property 'textDocumentSync' are incompatible. Type 'string' is not assignable to type '0 | TextDocumentSyncOptions | 1 | 2 | undefined'.`

        Жму **F12** на `textDocumentSync` и нахожу описание типа в котором указано, что значение `1` соответствует полной синхронизации документа и сервера. Установливаю пока это значение.

    - `Property 'loc' does not exist on type 'AstIdentifier'.`

        Опыт работы с библиотекой `json-to-ast` во втором задании подсказывает, что у интерфейса `AstIdentifier` забыли указать поле `loc`. [Исходники библиотеки](https://github.com/vtrushin/json-to-ast/blob/master/lib/parse.js#L231) лишь подтверждают это.
