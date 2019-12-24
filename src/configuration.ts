export enum RuleKey {
    textSeveralH1 = "textSeveralH1",
    textInvalidH2Position = "textInvalidH2Position",
    textInvalidH3Position = "textInvalidH3Position",
    warningInvalidButtonPosition = "warningInvalidButtonPosition",
    warningInvalidButtonSize = "warningInvalidButtonSize",
    warningInvalidPlaceholderSize = "warningInvalidPlaceholderSize",
    warningTextSizesShouldBeEqual = "warningTextSizesShouldBeEqual",
    gridTooMuchMarketingBlocks = "gridTooMuchMarketingBlocks"
}

export const RuleCodes: { [code: string]: RuleKey } = {
    "TEXT.SEVERAL_H1": RuleKey.textSeveralH1,
    "TEXT.INVALID_H2_POSITION": RuleKey.textInvalidH2Position,
    "TEXT.INVALID_H3_POSITION": RuleKey.textInvalidH3Position,
    "WARNING.INVALID_BUTTON_POSITION": RuleKey.warningInvalidButtonPosition,
    "WARNING.INVALID_BUTTON_SIZE": RuleKey.warningInvalidButtonSize,
    "WARNING.INVALID_PLACEHOLDER_SIZE": RuleKey.warningInvalidPlaceholderSize,
    "WARNING.TEXT_SIZES_SHOULD_BE_EQUAL": RuleKey.warningTextSizesShouldBeEqual,
    "GRID.TOO_MUCH_MARKETING_BLOCKS": RuleKey.gridTooMuchMarketingBlocks
};

export enum Severity {
    Error = "Error",
    Warning = "Warning",
    Information = "Information",
    Hint = "Hint",
    None = "None"
}

export type SeverityConfiguration = {
    [key in RuleKey]: Severity;
};

export interface ExampleConfiguration {
    enable: boolean;
    severity: SeverityConfiguration;
}
