@echo off
setlocal

maestro test .maestro/fail_login_flow.yml
maestro test .maestro/successful_login_logout_flow.yml

endlocal
