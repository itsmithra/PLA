import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import Link from "next/link";
import { ArrowLeft, Database, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function SupabaseTestPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Attempt to select from todos table if created in Supabase
  let todos: any[] | null = null;
  let queryError: string | null = null;

  try {
    const { data, error } = await supabase.from("todos").select();
    if (error) {
      queryError = error.message;
    } else {
      todos = data;
    }
  } catch (err: any) {
    queryError = err.message;
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] py-12 px-4 sm:px-6 lg:px-8 max-w-xl mx-auto w-full space-y-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-600 font-semibold"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
      </Link>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Supabase Live Connection Test
              </h2>
              <p className="text-xs text-slate-500">
                Connected to <code className="text-indigo-600 font-mono text-[11px]">{process.env.NEXT_PUBLIC_SUPABASE_URL}</code>
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Todos Table Query Result:
            </h3>

            {todos && todos.length > 0 ? (
              <ul className="space-y-1.5">
                {todos.map((todo) => (
                  <li
                    key={todo.id}
                    className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{todo.name || todo.title || JSON.stringify(todo)}</span>
                  </li>
                ))}
              </ul>
            ) : todos && todos.length === 0 ? (
              <p className="text-xs text-slate-500 italic p-3 bg-slate-50 rounded-lg">
                Connection successful! Table &apos;todos&apos; exists but currently contains 0 records.
              </p>
            ) : (
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-800 dark:text-amber-300 space-y-1">
                <p className="font-semibold">Supabase Client Connected.</p>
                <p className="text-[11px] text-amber-700 dark:text-amber-400">
                  {queryError || "If the 'todos' table has not yet been created in your Supabase project, you can run your database migrations or create the table in Supabase Table Editor."}
                </p>
              </div>
            )}
          </div>

          <div className="pt-2 flex justify-end">
            <Link href="/dashboard">
              <Button size="sm" variant="primary">
                Go to Student Dashboard
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
