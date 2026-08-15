const AuthPage = () => {
  return (
    <main className="min-h-screen bg-neutral-950 text-white flex items-center justify-center px-6">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-12 items-center">
        
        {/* Branding */}
        <section className="hidden md:block">
          <div className="max-w-md">
            <div className="mb-6">
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-green-400">
                DuoBrew POS
              </span>

              <h1 className="mt-3 text-5xl font-bold tracking-tight">
                Brew better.
                <br />
                Manage smarter.
              </h1>
            </div>

            <p className="text-lg leading-relaxed text-neutral-400">
              DuoBrew is a beverage store offering coffee, milk tea, and iced tea.
              Our POS system makes it easier to manage orders, products, payments,
              and daily sales in one place.
            </p>

            <p className="mt-6 text-sm text-neutral-500">
              Your drinks. Your orders. Your business.
            </p>
          </div>
        </section>

        {/* Login Card */}
        <section className="w-full max-w-md mx-auto">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-8 shadow-2xl">
            
            <div className="mb-8">
              <h2 className="text-3xl font-bold tracking-tight">
                Welcome back
              </h2>

              <p className="mt-2 text-sm text-neutral-400">
                Sign in to access your DuoBrew POS account.
              </p>
            </div>

            <form className="space-y-5">
              
              {/* Email */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-neutral-200"
                >
                  Email
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-3 text-sm text-white placeholder:text-neutral-500 outline-none transition focus:border-green-400 focus:ring-2 focus:ring-green-400/20"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-neutral-200"
                >
                  Password
                </label>

                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-3 text-sm text-white placeholder:text-neutral-500 outline-none transition focus:border-green-400 focus:ring-2 focus:ring-green-400/20"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full rounded-lg bg-green-500 px-4 py-3 text-sm font-semibold text-black transition hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-green-400/50 active:scale-[0.99]"
              >
                Sign in
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-neutral-500">
              DuoBrew Point of Sale
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default AuthPage;