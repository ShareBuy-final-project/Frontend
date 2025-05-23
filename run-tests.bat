@echo off
setlocal

maestro test .maestro/creatAccount.yml
maestro test .maestro/login.yml
maestro test .maestro/searchByName.yml
maestro test .maestro/clearSearchBar.yml
maestro test .maestro/searchByCategory.yml
maestro test .maestro/clearSearchBar.yml
maestro test .maestro/saveGroup.yml
maestro test .maestro/joinGroup.yml
maestro test .maestro/chat.yml
maestro test .maestro/leaveGroup.yml

endlocal
