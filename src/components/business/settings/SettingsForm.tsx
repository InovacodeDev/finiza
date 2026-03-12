"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";
import { toast } from "sonner";
import {
    Palette,
    Settings2,
    Target,
    ChevronRight,
    Bell,
    Globe,
    DollarSign,
    Save
} from "lucide-react";
import { updateSettingsSchema, type UpdateSettingsInput } from "@/schemas/profile-schema";
import { updateSettings, type UserProfile } from "@/app/actions/profileActions";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "./ThemeToggle";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SettingsFormProps {
    initialData: UserProfile;
}

export function SettingsForm({ initialData }: SettingsFormProps) {
    const [isPending, startTransition] = React.useTransition();

    const form = useForm<UpdateSettingsInput>({
        resolver: zodResolver(updateSettingsSchema) as Resolver<UpdateSettingsInput>,
        defaultValues: {
            currency: initialData.currency || "BRL",
            language: initialData.language || "pt-BR",
            reserva_meses: initialData.reserva_meses || 6,
            notifications_enabled: initialData.notifications_enabled ?? true,
        },
    });

    const isDirty = form.formState.isDirty;

    async function onSubmit(data: UpdateSettingsInput) {
        startTransition(async () => {
            const result = await updateSettings(data);
            if (result.success) {
                toast.success("Configurações atualizadas com sucesso!");
                form.reset(data);
            } else {
                toast.error(result.error || "Erro ao atualizar configurações");
            }
        });
    }

    return (
        <Tabs defaultValue="visual" className="w-full">
            <div className="flex justify-center md:justify-start mb-8">
                <TabsList className="flex h-12 items-center justify-start rounded-2xl bg-zinc-900/50 p-1 backdrop-blur-md border border-white/5 w-full max-w-md">
                    <TabsTrigger
                        value="visual"
                        className="flex-1 flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100 data-[state=active]:shadow-sm"
                    >
                        <Palette className="w-4 h-4" />
                        <span>Visual</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="system"
                        className="flex-1 flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100 data-[state=active]:shadow-sm"
                    >
                        <Settings2 className="w-4 h-4" />
                        <span>Sistema</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="goals"
                        className="flex-1 flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100 data-[state=active]:shadow-sm"
                    >
                        <Target className="w-4 h-4" />
                        <span>Metas</span>
                    </TabsTrigger>
                </TabsList>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <TabsContent value="visual" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                    <Card className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 shadow-2xl rounded-3xl overflow-hidden">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-xl font-bold text-zinc-100 flex items-center gap-2">
                                <Palette className="w-5 h-5 text-primary" />
                                Preferências Visuais
                            </CardTitle>
                            <CardDescription className="text-zinc-400">
                                Personalize a aparência e sensação do Finiza.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-2">
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                                <div className="space-y-1">
                                    <h4 className="font-semibold text-zinc-100">Tema do Aplicativo</h4>
                                    <p className="text-xs text-zinc-400 max-w-[240px]">
                                        Escolha entre o modo claro, escuro ou siga as definições do seu sistema.
                                    </p>
                                </div>
                                <ThemeToggle />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="system" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <Card className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 shadow-2xl rounded-3xl overflow-hidden">
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-xl font-bold text-zinc-100 flex items-center gap-2">
                                        <Settings2 className="w-5 h-5 text-primary" />
                                        Configurações do Sistema
                                    </CardTitle>
                                    <CardDescription className="text-zinc-400">
                                        Configure parâmetros regionais e de comunicação.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6 pt-2">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField
                                            control={form.control}
                                            name="currency"
                                            render={({ field }) => (
                                                <FormItem className="space-y-2">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <DollarSign className="w-4 h-4 text-zinc-400" />
                                                        <FormLabel className="text-zinc-200">Moeda Principal</FormLabel>
                                                    </div>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        value={field.value}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger className="bg-zinc-950/50 border-white/5 rounded-xl h-11 focus:ring-primary/20 transition-all hover:bg-white/5">
                                                                <SelectValue placeholder="Selecione a moeda" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent className="bg-zinc-900/95 border-white/5 rounded-xl shadow-2xl backdrop-blur-xl">
                                                            <SelectItem value="BRL" className="rounded-lg focus:bg-white/10">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-500 text-[10px] font-bold">R$</span>
                                                                    <span>Real Brasileiro</span>
                                                                </div>
                                                            </SelectItem>
                                                            <SelectItem value="USD" className="rounded-lg focus:bg-white/10">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500/20 text-blue-500 text-[10px] font-bold">$</span>
                                                                    <span>Dólar Americano</span>
                                                                </div>
                                                            </SelectItem>
                                                            <SelectItem value="EUR" className="rounded-lg focus:bg-white/10">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/20 text-amber-500 text-[10px] font-bold">€</span>
                                                                    <span>Euro</span>
                                                                </div>
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="language"
                                            render={({ field }) => (
                                                <FormItem className="space-y-2">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Globe className="w-4 h-4 text-zinc-400" />
                                                        <FormLabel className="text-zinc-200">Idioma</FormLabel>
                                                    </div>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        value={field.value}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger className="bg-zinc-950/50 border-white/5 rounded-xl h-11 focus:ring-primary/20 transition-all hover:bg-white/5">
                                                                <SelectValue placeholder="Selecione o idioma" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent className="bg-zinc-900/95 border-white/5 rounded-xl shadow-2xl backdrop-blur-xl">
                                                            <SelectItem value="pt-BR" className="rounded-lg focus:bg-white/10">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-sm">🇧🇷</span>
                                                                    <span>Português (Brasil)</span>
                                                                </div>
                                                            </SelectItem>
                                                            <SelectItem value="en-US" className="rounded-lg focus:bg-white/10">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-sm">🇺🇸</span>
                                                                    <span>English (US)</span>
                                                                </div>
                                                            </SelectItem>
                                                            <SelectItem value="es" className="rounded-lg focus:bg-white/10">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-sm">🇪🇸</span>
                                                                    <span>Español</span>
                                                                </div>
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="notifications_enabled"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center justify-between rounded-2xl bg-white/5 border border-white/5 p-4 transition-all hover:bg-white/10 group">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center transition-colors group-hover:bg-primary/20">
                                                            <Bell className="w-4 h-4 text-primary" />
                                                        </div>
                                                        <FormLabel className="text-base font-semibold text-zinc-100">
                                                            Alertas de Previsão
                                                        </FormLabel>
                                                    </div>
                                                    <FormDescription className="text-xs text-zinc-400 pl-10">
                                                        Receba alertas sobre meses com previsão de saldo negativo.
                                                    </FormDescription>
                                                </div>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                        className="data-[state=checked]:bg-emerald-500 shadow-inner scale-110"
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                                <CardFooter className="bg-white/2 pt-6 pb-6 border-t border-white/5">
                                    <Button
                                        type="submit"
                                        disabled={!isDirty || isPending}
                                        className={cn(
                                            "w-full md:w-auto px-8 h-11 rounded-xl font-bold transition-all active:scale-95 disabled:pointer-events-none",
                                            isDirty 
                                                ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" 
                                                : "bg-zinc-800/50 text-zinc-500 border border-white/5 opacity-50"
                                        )}
                                    >
                                        {isPending ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Salvando...
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <Save className="w-4 h-4 transition-transform group-hover:scale-110" />
                                                Salvar Configurações
                                            </div>
                                        )}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </form>
                    </Form>
                </TabsContent>

                <TabsContent value="goals" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <Card className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 shadow-2xl rounded-3xl overflow-hidden">
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-xl font-bold text-zinc-100 flex items-center gap-2">
                                        <Target className="w-5 h-5 text-primary" />
                                        Metas e Planejamento
                                    </CardTitle>
                                    <CardDescription className="text-zinc-400">
                                        Defina os parâmetros para o cálculo automático de metas financeiras.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6 pt-2">
                                    <FormField
                                        control={form.control}
                                        name="reserva_meses"
                                        render={({ field }) => (
                                            <FormItem className="space-y-3 p-4 rounded-2xl bg-white/5 border border-white/5">
                                                <div className="flex flex-col gap-1">
                                                    <FormLabel className="text-zinc-100 font-semibold">Tamanho da Reserva de Emergência</FormLabel>
                                                    <FormDescription className="text-xs text-zinc-400">
                                                        Quantos meses de custo de vida você deseja manter guardados?
                                                    </FormDescription>
                                                </div>
                                                <Select
                                                    onValueChange={(val) => field.onChange(parseInt(val))}
                                                    value={field.value?.toString()}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className="bg-zinc-950/50 border-white/5 rounded-xl h-11 focus:ring-primary/20 transition-all hover:bg-white/5">
                                                            <SelectValue placeholder="Selecione a quantidade de meses" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className="bg-zinc-900/95 border-white/5 rounded-xl shadow-2xl backdrop-blur-xl">
                                                        {[1, 3, 6, 12, 18, 24].map((m) => (
                                                            <SelectItem key={m} value={m.toString()} className="rounded-lg focus:bg-white/10">
                                                                <div className="flex items-center gap-2">
                                                                    <Target className="w-3 h-3 text-primary/60" />
                                                                    <span>{m} {m === 1 ? "mês" : "meses"} de custo de vida</span>
                                                                </div>
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                                <div className="mt-4 p-3 rounded-xl bg-primary/10 border border-primary/20 flex items-start gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                                                        <ChevronRight className="w-5 h-5 text-primary" />
                                                    </div>
                                                    <p className="text-xs text-zinc-300 leading-relaxed">
                                                        <span className="font-bold text-primary block mb-0.5">Dica Financeira</span>
                                                        Recomendamos pelo menos 6 meses para profissionais CLT e 12 meses para autônomos ou empresários.
                                                    </p>
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                                <CardFooter className="bg-white/2 pt-6 pb-6 border-t border-white/5">
                                    <Button
                                        type="submit"
                                        disabled={!isDirty || isPending}
                                        className={cn(
                                            "w-full md:w-auto px-8 h-11 rounded-xl font-bold transition-all active:scale-95 disabled:pointer-events-none",
                                            isDirty 
                                                ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" 
                                                : "bg-zinc-800/50 text-zinc-500 border border-white/5 opacity-50"
                                        )}
                                    >
                                        {isPending ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Salvando...
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <Save className="w-4 h-4" />
                                                Salvar Meta
                                            </div>
                                        )}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </form>
                    </Form>
                </TabsContent>
            </motion.div>
        </Tabs>
    );
}
