'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

// Excluimos os métodos CREATE e EDIT pois esses dois métodos são utilizados quando estamos fazendo uma estrutura full MVC, ou seja, que tenha a parte das views e não só uma Api REST. Esses 2 métodos representariam os nossos forms de criação e edição de tweets, mas como não teremos um form pelo backend vamos utilizar o método STORE para criar um novo Tweet e o Método UPDATE para atualizar os Tweets

const Tweet = use('App/Models/Tweet')

/**
 * Resourceful controller for interacting with tweets
 */
class TweetController {
  /**
   * Show a list of all tweets.
   * GET tweets
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index () {
    const tweets = await Tweet.query().with('user').fetch()

    return tweets
  }

  // /**
  //  * Render a form to be used for creating a new tweet.
  //  * GET tweets/create
  //  *
  //  * @param {object} ctx
  //  * @param {Request} ctx.request
  //  * @param {Response} ctx.response
  //  * @param {View} ctx.view
  //  */
  // async create ({ request, response, view }) {
  // }

  /**
   * Create/save a new tweet.
   * POST tweets
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */

   // automaticamente para um usuário fazer um tweet ele precisa estar logado, logo, vamos pegar o id do usuário através do token de autenticação que foi enviado na requisição

  async store ({ request, auth }) {
    const data = request.only(['content'])

    const tweet = await Tweet.create({ user_id: auth.user.id, ...data })

    return tweet
  }

  /**
   * Display a single tweet.
   * GET tweets/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
    const tweet = await Tweet.findOrFail(params.id)

    return tweet
  }

  // /**
  //  * Render a form to update an existing tweet.
  //  * GET tweets/:id/edit
  //  *
  //  * @param {object} ctx
  //  * @param {Request} ctx.request
  //  * @param {Response} ctx.response
  //  * @param {View} ctx.view
  //  */
  // async edit ({ params, request, response, view }) {
  // }

  /**
   * Update tweet details.
   * PUT or PATCH tweets/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a tweet with id.
   * DELETE tweets/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */

  // não queremos que um usuário delete um tweet de outro usuário, só o dele mesmo, então vamos fazer um if para atestar se aquele tweet pertence ao seu devido usuário

  async destroy ({ params, auth, request, response }) {
    const tweet = await Tweet.findOrFail(params.id)

    if (tweet.user_id !== auth.user.id) {
      return response.status(401)
    }

    await tweet.delete()
  }
}

module.exports = TweetController
