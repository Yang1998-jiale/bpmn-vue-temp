<!--
 * @Author: yjl
 * @Date: 2024-04-10 09:53:00
 * @LastEditors: yjl
 * @LastEditTime: 2024-04-11 16:11:43
 * @Description: 描述
-->
# 更换 npm 官方镜像
npm config set registry http://registry.npmjs.org/

# 发布流程
1. pnpm build  
2. pnpm publish(pnpm publish --no-git-checks)