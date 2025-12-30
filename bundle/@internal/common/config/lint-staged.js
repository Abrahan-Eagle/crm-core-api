const lintStagedConfig = {
  '*.ts': ['eslint --fix', 'jest --bail --findRelatedTests --passWithNoTests'],
  '*.json': ['prettier --write']
}

module.exports = {
  lintStagedConfig,
  default: lintStagedConfig
}
