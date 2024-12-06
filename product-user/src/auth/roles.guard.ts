import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {
    }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.get<string[]>('role', context.getHandler());
        if (!requiredRoles) { // If no roles are assigned
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        // If no user is found, deny access
        if (!user) {
            return false;
        }

        return requiredRoles.includes(user.role);

    }
}