import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSearchParams, useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useEffect } from "react";

const formSchema = z.object({
  search: z.string().min(2, {
    message: "Tag must be at least 2 characters.", // Updated minimum length message
  }),
});

export function SearchBar() {
  const query = useSearchParams();
  const router = useRouter();

  // Initialize useForm with zodResolver and defaultValues from query parameters
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      search: query.get("search") || "", // Set default value from query parameter
    },
  });

  const searchValue = query.get("search") || "";

  // Update form field value when query parameter changes
  useEffect(() => {
    form.setValue("search", searchValue);
  }, [searchValue, form]);

  // Define a submit handler
  async function onSubmit(values) {
    if (values.search) {
      router.push(`/browse/?search=${encodeURIComponent(values.search)}`);
    } else {
      router.push("/browse");
    }
  }

  // Render the SearchBar component
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-3 items-start">
          <FormField
            control={form.control}
            name="search"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Filter rooms by tags..."
                    className="w-[450px] rounded-xl bg-card/80 dark:bg-white/[0.03] backdrop-blur-sm border-border dark:border-white/10 focus:border-violet-500 focus:ring-violet-500/20 transition-colors font-mono text-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button type="submit" className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white shadow-lg shadow-violet-600/20 border-0">
            <Search className="w-4 h-4" /> Search
          </Button>

          {/* Clear Button */}
          {query.get("search") && (
            <Button
              variant="link"
              className="text-muted-foreground hover:text-violet-500 transition-colors"
              onClick={() => {
                form.setValue("search", "");
                router.push("/browse");
              }}
            >
              Clear
            </Button>
          )}
        </form>
      </Form>
    </div>
  );
}
