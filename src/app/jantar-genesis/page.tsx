"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

interface FormData {
  nome: string;
  telefone: string;
  idade: string;
}

export default function JantarGenesis() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<FormData>();

  const [formularioEnviado, setFormularioEnviado] = useState(false);
  const [dadosFormulario, setDadosFormulario] = useState<FormData | null>(null);
  const [linkPagamento, setLinkPagamento] = useState("");

  const idadeAtual = watch("idade");

  const calcularValorELink = (idade: number) => {
    if (idade <= 5) {
      return { valor: 0, link: "", texto: "Gratuito para crianças até 5 anos" };
    } else if (idade >= 6 && idade <= 12) {
      return { 
        valor: 30, 
        link: "https://mpago.la/2X8C8Xg", 
        texto: "R$ 30,00 - Crianças de 6 a 12 anos" 
      };
    } else {
      return { 
        valor: 60, 
        link: "https://mpago.la/1tpEzgf", 
        texto: "R$ 60,00 - Valor normal" 
      };
    }
  };

  const onSubmit = async (data: FormData) => {
    console.log("Dados do formulário:", data);

    try {
      // Prepara os dados para envio conforme o formato da API
      const dadosApi = {
        nome: data.nome,
        telefone: data.telefone,
        idade: parseInt(data.idade) || 0,
      };

      // Envia os dados para a API
      const response = await fetch(
        "https://base.rubensgouveia.com.br/api/database/rows/table/19/?user_field_names=true",
        {
          method: "POST",
          headers: {
            Authorization: "Token J7zCGAUJE6GFjwb8deqEyGhl3hqGBD4t",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dadosApi),
        }
      );

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }

      const resultado = await response.json();
      console.log("Usuário cadastrado com sucesso:", resultado);

      // Calcula o valor e link baseado na idade
      const idade = parseInt(data.idade) || 0;
      const { link } = calcularValorELink(idade);
      
      setDadosFormulario(data);
      setLinkPagamento(link);
      setFormularioEnviado(true);
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      alert("Erro ao enviar formulário. Por favor, tente novamente.");
    }
  };

  const formatarTelefone = (valor: string) => {
    // Remove tudo que não é dígito
    const somenteNumeros = valor.replace(/\D/g, "");

    // Aplica a máscara (00) 00000-0000
    if (somenteNumeros.length <= 2) {
      return somenteNumeros;
    } else if (somenteNumeros.length <= 7) {
      return `(${somenteNumeros.slice(0, 2)}) ${somenteNumeros.slice(2)}`;
    } else {
      return `(${somenteNumeros.slice(0, 2)}) ${somenteNumeros.slice(
        2,
        7
      )}-${somenteNumeros.slice(7, 11)}`;
    }
  };

  // Tela de sucesso
  if (formularioEnviado && dadosFormulario) {
    const primeiroNome = dadosFormulario.nome.split(" ")[0];
    const idade = parseInt(dadosFormulario.idade) || 0;
    const { valor, texto } = calcularValorELink(idade);

    return (
      <div className="bg-amber-500/5 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-background rounded-lg shadow-xl p-6 md:p-8 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-label="Ícone de sucesso"
              >
                <title>Sucesso</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#ef8e2e] mb-4">
              Obrigado, {primeiroNome}!
            </h1>
            <p className="text-lg text-foreground/90 mb-4">
              Sua inscrição para o Jantar Genesis foi realizada com sucesso! ✨
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm font-medium text-gray-600 mb-2">
                Valor da inscrição:
              </p>
              <p className="text-lg font-bold text-[#ef8e2e]">
                {texto}
              </p>
            </div>

            {valor > 0 && linkPagamento && (
              <div className="space-y-4">
                <p className="text-sm text-foreground/70 mb-4">
                  Clique no botão abaixo para realizar o pagamento:
                </p>
                <a
                  href={linkPagamento}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  💳 Pagar R$ {valor},00
                </a>
                <p className="text-xs text-foreground/60 mt-2">
                  Você será redirecionado para o Mercado Pago
                </p>
              </div>
            )}
            
            {valor === 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-medium">
                  🎉 Sua inscrição é gratuita!
                </p>
                <p className="text-green-700 text-sm mt-1">
                  Não é necessário realizar pagamento.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-amber-500/5 min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-background rounded-lg shadow-xl p-6 md:p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[#ef8e2e] mb-2">
            Jantar Genesis
          </h1>
          <p className="text-foreground/70 mb-4">
            Faça sua inscrição para este evento especial
          </p>
          
          {/* Informações de preço */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-left">
            <h3 className="font-semibold text-amber-800 mb-2">💰 Valores:</h3>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• Até 5 anos: <strong>Gratuito</strong></li>
              <li>• 6 a 12 anos: <strong>R$ 30,00</strong></li>
              <li>• Acima de 12 anos: <strong>R$ 60,00</strong></li>
            </ul>
          </div>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Dados Pessoais */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#ef8e2e] border-b border-[#ef8e2e]/20 pb-2">
              Dados da Inscrição
            </h3>

            {/* Nome */}
            <div>
              <label
                htmlFor="nome"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Nome Completo *
              </label>
              <input
                id="nome"
                type="text"
                {...register("nome", {
                  required: "Nome é obrigatório",
                  minLength: {
                    value: 2,
                    message: "Nome deve ter pelo menos 2 caracteres",
                  },
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ef8e2e] focus:border-transparent transition-colors"
                placeholder="Digite seu nome completo"
              />
              {errors.nome && (
                <span className="text-red-500 text-sm mt-1 block">
                  {errors.nome.message}
                </span>
              )}
            </div>

            {/* Telefone e Idade */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="telefone"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Telefone *
                </label>
                <input
                  id="telefone"
                  type="tel"
                  {...register("telefone", {
                    required: "Telefone é obrigatório",
                    pattern: {
                      value: /^\(\d{2}\)\s\d{5}-\d{4}$/,
                      message: "Formato: (xx) xxxxx-xxxx",
                    },
                  })}
                  onChange={(e) => {
                    const valorFormatado = formatarTelefone(e.target.value);
                    e.target.value = valorFormatado;
                    setValue("telefone", valorFormatado);
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ef8e2e] focus:border-transparent transition-colors"
                  placeholder="(83) 99999-9999"
                  maxLength={15}
                />
                {errors.telefone && (
                  <span className="text-red-500 text-sm mt-1 block">
                    {errors.telefone.message}
                  </span>
                )}
              </div>

              <div>
                <label
                  htmlFor="idade"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Idade *
                </label>
                <input
                  id="idade"
                  type="number"
                  min="0"
                  max="120"
                  {...register("idade", {
                    required: "Idade é obrigatória",
                    min: {
                      value: 0,
                      message: "Idade deve ser maior que 0"
                    },
                    max: {
                      value: 120,
                      message: "Idade deve ser menor que 120"
                    }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ef8e2e] focus:border-transparent transition-colors"
                  placeholder="Digite sua idade"
                />
                {errors.idade && (
                  <span className="text-red-500 text-sm mt-1 block">
                    {errors.idade.message}
                  </span>
                )}
              </div>
            </div>

            {/* Prévia do valor */}
            {idadeAtual && !isNaN(parseInt(idadeAtual)) && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 font-medium">
                  💡 {calcularValorELink(parseInt(idadeAtual)).texto}
                </p>
              </div>
            )}
          </div>

          {/* Botões */}
          <div className="flex justify-center pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full max-w-md bg-[#ef8e2e] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#d77a26] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? "Processando..." : "Confirmar Inscrição"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}