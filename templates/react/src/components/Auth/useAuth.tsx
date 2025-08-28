import { useContext } from 'react';
import { AuthContext } from './AuthProvider';

export function useAuth(code: string): boolean {
  const { authList } = useContext(AuthContext);
  const flattenAuthList = (nodes: any[]): string[] => {
    let result: string[] = [];
    nodes.forEach(node => {
      if (node.menuType === '3') {
        result.push(node.permission);
      }
      if (node.children) {
        result = result.concat(flattenAuthList(node.children));
      }
    });
    return result;
  };
  const authIdsWithMenuType3 = flattenAuthList(authList);
  return authIdsWithMenuType3.includes(code);
}