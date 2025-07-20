import { CheckIcon, XIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Permission, Actions, Resources } from "@/lib/types";

export default function RoleResourceMatrix({ permissions }: { permissions: Permission[] }) {
  const roles = Array.from(new Set(permissions.map((p) => p.role)));
  const resources = Array.from(new Set(permissions.map((p) => p.resource)));
  const actions = [Actions.READ, Actions.CREATE, Actions.UPDATE, Actions.DELETE];

  function isAllowed(role: string, resource: Resources, action: Actions) {
    return permissions.some(
      (p) => p.role === role && p.resource === resource && p.action === action && p.allowed
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="*:border-border border-y-0 hover:bg-transparent [&>:not(:last-child)]:border-r">
          <TableCell></TableCell>
          {roles.map((role) => (
            <TableHead
              key={role}
              className="text-foreground h-auto py-3 align-bottom"
            >
              <span className="relative left-[calc(50%-.5rem)] block rotate-180 leading-4 whitespace-nowrap [text-orientation:sideways] [writing-mode:vertical-rl]">
                {role}
              </span>
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {resources.map((resource) => (
          <TableRow key={resource} className="*:border-border [&>:not(:last-child)]:border-r">
            <TableHead className="text-foreground font-medium">{resource}</TableHead>
            {roles.map((role) => (
              <TableCell key={role} className="space-y-1 text-center">
                {actions.map((action) => (
                  <div key={action} className="flex items-center justify-center">
                    {isAllowed(role, resource, action) ? (
                      <CheckIcon className="inline-flex stroke-emerald-600" size={16} aria-hidden="true" />
                    ) : (
                      <XIcon className="inline-flex stroke-red-600" size={16} aria-hidden="true" />
                    )}
                    <span className="sr-only">
                      {isAllowed(role, resource, action) ? "Allowed" : "Not allowed"}
                    </span>
                  </div>
                ))}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
